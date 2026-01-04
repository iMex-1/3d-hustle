import { memo } from "react";

/**
 * Modern loading components optimized for React 19 Suspense
 * Provides various loading states with smooth animations
 */

// Main loading fallback for route-level suspense
export const RouteLoadingFallback = memo(() => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#0a0a0a",
    }}
  >
    <div style={{ position: "relative", width: "48px", height: "48px" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "3px solid rgba(200, 170, 110, 0.2)",
          borderRadius: "50%",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "3px solid transparent",
          borderTopColor: "#c8aa6e",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      ></div>
    </div>
  </div>
));

// Component-level loading fallback
export const ComponentLoadingFallback = memo(({ message = "Loading..." }) => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <div className="w-8 h-8 mx-auto mb-3">
        <div className="w-full h-full border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  </div>
));

// Skeleton loading for lists
export const ListSkeletonFallback = memo(({ items = 6 }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="flex items-center space-x-4 p-4 bg-card rounded-lg border border-border">
          <div className="w-16 h-16 bg-muted rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
            <div className="h-3 bg-muted rounded w-1/4"></div>
          </div>
          <div className="w-20 h-8 bg-muted rounded"></div>
        </div>
      </div>
    ))}
  </div>
));

// Card grid skeleton
export const CardGridSkeletonFallback = memo(({ cards = 8 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: cards }).map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="w-full h-48 bg-muted"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-full"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-3 bg-muted rounded w-1/4"></div>
              <div className="h-8 bg-muted rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
));

// 3D viewer loading fallback
export const ViewerLoadingFallback = memo(() => (
  <div className="w-full h-full min-h-[400px] bg-card border border-border rounded-lg flex items-center justify-center">
    <div className="text-center">
      <div className="relative w-20 h-20 mx-auto mb-4">
        {/* 3D cube animation */}
        <div
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: "3s" }}
        >
          <div className="w-full h-full border-2 border-primary/30 border-dashed rounded-lg"></div>
        </div>
        <div className="absolute inset-2 animate-pulse">
          <div className="w-full h-full bg-primary/10 rounded"></div>
        </div>
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">
        Loading 3D Model
      </h3>
      <p className="text-sm text-muted-foreground">Preparing the viewer...</p>
    </div>
  </div>
));

// Data loading with progress
export const DataLoadingFallback = memo(
  ({ progress = 0, message = "Loading data..." }) => (
    <div className="flex items-center justify-center p-8">
      <div className="text-center max-w-xs">
        <div className="w-12 h-12 mx-auto mb-4 relative">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 36 36"
          >
            <path
              className="text-muted stroke-current"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-primary stroke-current transition-all duration-300 ease-in-out"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${progress}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-foreground">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  )
);

// Inline loading spinner
export const InlineLoadingFallback = memo(({ size = "sm", className = "" }) => {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-2 border-current border-t-transparent rounded-full animate-spin opacity-60`}
      ></div>
    </div>
  );
});

// Button loading state
export const ButtonLoadingFallback = memo(
  ({ children, loading = false, ...props }) => (
    <button {...props} disabled={loading || props.disabled}>
      <span className="flex items-center justify-center gap-2">
        {loading && <InlineLoadingFallback size="sm" />}
        {children}
      </span>
    </button>
  )
);

// Error retry loading
export const RetryLoadingFallback = memo(
  ({ onRetry, message = "Something went wrong" }) => (
    <div className="text-center p-8">
      <div className="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
        <svg
          className="w-8 h-8 text-destructive"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Loading Failed
      </h3>
      <p className="text-muted-foreground mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
      >
        Try Again
      </button>
    </div>
  )
);

// Set display names for better debugging
RouteLoadingFallback.displayName = "RouteLoadingFallback";
ComponentLoadingFallback.displayName = "ComponentLoadingFallback";
ListSkeletonFallback.displayName = "ListSkeletonFallback";
CardGridSkeletonFallback.displayName = "CardGridSkeletonFallback";
ViewerLoadingFallback.displayName = "ViewerLoadingFallback";
DataLoadingFallback.displayName = "DataLoadingFallback";
InlineLoadingFallback.displayName = "InlineLoadingFallback";
ButtonLoadingFallback.displayName = "ButtonLoadingFallback";
RetryLoadingFallback.displayName = "RetryLoadingFallback";
