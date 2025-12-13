import { useEffect, useCallback, useRef } from 'react';

/**
 * Performance monitoring hook for React 19 applications
 * Tracks component render times, memory usage, and user interactions
 */

// Performance metrics store
const performanceMetrics = {
    renders: new Map(),
    interactions: new Map(),
    memory: [],
    vitals: new Map()
};

// Web Vitals tracking
let vitalsObserver = null;

export function usePerformance(componentName, options = {}) {
    const {
        trackRenders = true,
        trackMemory = false,
        trackInteractions = true,
        sampleRate = 1.0 // 0.0 to 1.0
    } = options;

    const renderStartTime = useRef(null);
    const renderCount = useRef(0);
    const mountTime = useRef(null);

    // Should we track this render based on sample rate?
    const shouldTrack = useCallback(() => {
        return Math.random() < sampleRate;
    }, [sampleRate]);

    // Track component mount time
    useEffect(() => {
        if (!shouldTrack()) return;

        mountTime.current = performance.now();

        return () => {
            if (mountTime.current) {
                const unmountTime = performance.now();
                const mountDuration = unmountTime - mountTime.current;

                console.log(`[Performance] ${componentName} lifecycle: ${mountDuration.toFixed(2)}ms`);

                // Store metric
                if (!performanceMetrics.renders.has(componentName)) {
                    performanceMetrics.renders.set(componentName, []);
                }
                performanceMetrics.renders.get(componentName).push({
                    type: 'lifecycle',
                    duration: mountDuration,
                    timestamp: Date.now()
                });
            }
        };
    }, [componentName, shouldTrack]);

    // Track render performance
    useEffect(() => {
        if (!trackRenders || !shouldTrack()) return;

        renderStartTime.current = performance.now();
        renderCount.current++;

        // Use requestIdleCallback for non-blocking measurement
        const measureRender = () => {
            if (renderStartTime.current) {
                const renderEndTime = performance.now();
                const renderDuration = renderEndTime - renderStartTime.current;

                // Only log slow renders in development
                if (import.meta.env.DEV && renderDuration > 16) {
                    console.warn(`[Performance] Slow render in ${componentName}: ${renderDuration.toFixed(2)}ms`);
                }

                // Store metric
                if (!performanceMetrics.renders.has(componentName)) {
                    performanceMetrics.renders.set(componentName, []);
                }
                performanceMetrics.renders.get(componentName).push({
                    type: 'render',
                    duration: renderDuration,
                    count: renderCount.current,
                    timestamp: Date.now()
                });
            }
        };

        if (window.requestIdleCallback) {
            window.requestIdleCallback(measureRender);
        } else {
            setTimeout(measureRender, 0);
        }
    });

    // Track memory usage
    useEffect(() => {
        if (!trackMemory || !shouldTrack() || !performance.memory) return;

        const measureMemory = () => {
            const memInfo = {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit,
                component: componentName,
                timestamp: Date.now()
            };

            performanceMetrics.memory.push(memInfo);

            // Keep only last 100 measurements
            if (performanceMetrics.memory.length > 100) {
                performanceMetrics.memory.shift();
            }

            // Warn about memory usage in development
            if (import.meta.env.DEV) {
                const usagePercent = (memInfo.used / memInfo.limit) * 100;
                if (usagePercent > 80) {
                    console.warn(`[Performance] High memory usage in ${componentName}: ${usagePercent.toFixed(1)}%`);
                }
            }
        };

        const interval = setInterval(measureMemory, 5000); // Every 5 seconds
        return () => clearInterval(interval);
    }, [componentName, trackMemory, shouldTrack]);

    // Track user interactions
    const trackInteraction = useCallback((interactionName, startTime = performance.now()) => {
        if (!trackInteractions || !shouldTrack()) return () => { };

        return () => {
            const endTime = performance.now();
            const duration = endTime - startTime;

            const key = `${componentName}.${interactionName}`;
            if (!performanceMetrics.interactions.has(key)) {
                performanceMetrics.interactions.set(key, []);
            }

            performanceMetrics.interactions.get(key).push({
                duration,
                timestamp: Date.now()
            });

            // Log slow interactions in development
            if (import.meta.env.DEV && duration > 100) {
                console.warn(`[Performance] Slow interaction ${key}: ${duration.toFixed(2)}ms`);
            }
        };
    }, [componentName, trackInteractions, shouldTrack]);

    // Measure async operations
    const measureAsync = useCallback(async (operationName, asyncFn) => {
        if (!shouldTrack()) return asyncFn();

        const startTime = performance.now();

        try {
            const result = await asyncFn();
            const endTime = performance.now();
            const duration = endTime - startTime;

            console.log(`[Performance] ${componentName}.${operationName}: ${duration.toFixed(2)}ms`);

            return result;
        } catch (error) {
            const endTime = performance.now();
            const duration = endTime - startTime;

            console.error(`[Performance] ${componentName}.${operationName} failed after ${duration.toFixed(2)}ms:`, error);
            throw error;
        }
    }, [componentName, shouldTrack]);

    return {
        trackInteraction,
        measureAsync,
        getMetrics: () => ({
            renders: performanceMetrics.renders.get(componentName) || [],
            interactions: Array.from(performanceMetrics.interactions.entries())
                .filter(([key]) => key.startsWith(componentName))
                .reduce((acc, [key, values]) => {
                    acc[key] = values;
                    return acc;
                }, {}),
            memory: performanceMetrics.memory.filter(m => m.component === componentName)
        })
    };
}

// Web Vitals tracking
export function useWebVitals() {
    useEffect(() => {
        if (vitalsObserver || !window.PerformanceObserver) return;

        // Track Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            performanceMetrics.vitals.set('LCP', lastEntry.startTime);
        });

        // Track First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                performanceMetrics.vitals.set('FID', entry.processingStart - entry.startTime);
            });
        });

        // Track Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    performanceMetrics.vitals.set('CLS', clsValue);
                }
            });
        });

        try {
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            fidObserver.observe({ entryTypes: ['first-input'] });
            clsObserver.observe({ entryTypes: ['layout-shift'] });

            vitalsObserver = { lcpObserver, fidObserver, clsObserver };
        } catch (error) {
            console.warn('Performance Observer not supported:', error);
        }

        return () => {
            if (vitalsObserver) {
                vitalsObserver.lcpObserver.disconnect();
                vitalsObserver.fidObserver.disconnect();
                vitalsObserver.clsObserver.disconnect();
                vitalsObserver = null;
            }
        };
    }, []);

    return {
        getVitals: () => Object.fromEntries(performanceMetrics.vitals),
        getLCP: () => performanceMetrics.vitals.get('LCP'),
        getFID: () => performanceMetrics.vitals.get('FID'),
        getCLS: () => performanceMetrics.vitals.get('CLS')
    };
}

// Performance reporting utilities
export function getPerformanceReport() {
    return {
        renders: Object.fromEntries(performanceMetrics.renders),
        interactions: Object.fromEntries(performanceMetrics.interactions),
        memory: performanceMetrics.memory,
        vitals: Object.fromEntries(performanceMetrics.vitals),
        timestamp: Date.now()
    };
}

export function clearPerformanceMetrics() {
    performanceMetrics.renders.clear();
    performanceMetrics.interactions.clear();
    performanceMetrics.memory.length = 0;
    performanceMetrics.vitals.clear();
}

// Development-only performance debugging
if (import.meta.env.DEV) {
    // Add global performance debugging functions
    window.__PERFORMANCE_DEBUG__ = {
        getReport: getPerformanceReport,
        clear: clearPerformanceMetrics,
        logSummary: () => {
            const report = getPerformanceReport();
            console.group('🚀 Performance Summary');

            // Render performance
            console.group('📊 Render Performance');
            Object.entries(report.renders).forEach(([component, renders]) => {
                const avgRenderTime = renders
                    .filter(r => r.type === 'render')
                    .reduce((sum, r, _, arr) => sum + r.duration / arr.length, 0);
                console.log(`${component}: ${avgRenderTime.toFixed(2)}ms avg, ${renders.length} renders`);
            });
            console.groupEnd();

            // Web Vitals
            if (Object.keys(report.vitals).length > 0) {
                console.group('⚡ Web Vitals');
                Object.entries(report.vitals).forEach(([metric, value]) => {
                    console.log(`${metric}: ${value.toFixed(2)}ms`);
                });
                console.groupEnd();
            }

            console.groupEnd();
        }
    };
}