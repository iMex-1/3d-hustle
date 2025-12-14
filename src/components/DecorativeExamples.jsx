import React from 'react';
import DecorativeDiamond, { 
    DecorativeDiamondGroup, 
    DecorativeSectionDivider, 
    CornerOrnament, 
    FloatingDecorations 
} from './DecorativeDiamond';
import '../styles/homepage-clean.css';

/**
 * Examples of how to use decorative elements throughout your application
 */
const DecorativeExamples = () => {
    return (
        <div className="min-h-screen bg-background text-foreground p-8">
            <div className="max-w-4xl mx-auto space-y-16">
                
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-display font-bold mb-4">
                        Decorative Elements Examples
                    </h1>
                    <p className="text-muted-foreground">
                        Moroccan-themed decorative components for filling gaps and adding visual interest
                    </p>
                </div>

                {/* Section Divider Example */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6">Section Dividers</h2>
                    <div className="space-y-8">
                        <div className="bg-card p-6 rounded-lg">
                            <p className="mb-4">Content above divider...</p>
                            <DecorativeSectionDivider />
                            <p className="mt-4">Content below divider...</p>
                        </div>
                        
                        <div className="bg-card p-6 rounded-lg">
                            <p className="mb-4">Divider with lines only:</p>
                            <DecorativeSectionDivider showDiamonds={false} />
                            <p className="mt-4">Clean and minimal...</p>
                        </div>
                    </div>
                </section>

                {/* Individual Diamonds */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6">Individual Diamonds</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <DecorativeDiamond size="xs" variant="outline" />
                            <p className="mt-2 text-sm">XS Outline</p>
                        </div>
                        <div className="text-center">
                            <DecorativeDiamond size="sm" variant="filled" />
                            <p className="mt-2 text-sm">SM Filled</p>
                        </div>
                        <div className="text-center">
                            <DecorativeDiamond size="md" variant="gradient" />
                            <p className="mt-2 text-sm">MD Gradient</p>
                        </div>
                        <div className="text-center">
                            <DecorativeDiamond size="lg" variant="gold" animated />
                            <p className="mt-2 text-sm">LG Gold Animated</p>
                        </div>
                    </div>
                </section>

                {/* Diamond Groups */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6">Diamond Groups</h2>
                    <div className="space-y-6">
                        <div className="bg-card p-6 rounded-lg">
                            <h3 className="text-lg font-medium mb-4">Line Pattern</h3>
                            <DecorativeDiamondGroup pattern="line" count={5} size="sm" />
                        </div>
                        
                        <div className="bg-card p-6 rounded-lg">
                            <h3 className="text-lg font-medium mb-4">Grid Pattern</h3>
                            <DecorativeDiamondGroup pattern="grid" count={9} size="xs" />
                        </div>
                        
                        <div className="bg-card p-6 rounded-lg">
                            <h3 className="text-lg font-medium mb-4">Cluster Pattern</h3>
                            <DecorativeDiamondGroup pattern="cluster" count={7} size="sm" />
                        </div>
                    </div>
                </section>

                {/* Cards with Corner Ornaments */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6">Cards with Corner Ornaments</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-card p-6 rounded-lg relative border border-border hover:border-accent transition-colors">
                            <CornerOrnament position="top-right" size="md" />
                            <h3 className="text-xl font-semibold mb-2">Card Title</h3>
                            <p className="text-muted-foreground">
                                This card has a decorative corner ornament that appears on hover.
                            </p>
                        </div>
                        
                        <div className="bg-card p-6 rounded-lg relative border border-border hover:border-accent transition-colors">
                            <CornerOrnament position="top-left" size="sm" />
                            <CornerOrnament position="bottom-right" size="sm" />
                            <h3 className="text-xl font-semibold mb-2">Multiple Corners</h3>
                            <p className="text-muted-foreground">
                                This card has ornaments in multiple corners for a more elaborate look.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Gap Filler Example */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6">Gap Fillers</h2>
                    <div className="bg-card p-6 rounded-lg">
                        <p className="text-center text-muted-foreground mb-4">
                            Content section above...
                        </p>
                    </div>
                    
                    {/* Gap Filler */}
                    <div className="gap-filler">
                        <div className="gap-filler-content">
                            <DecorativeSectionDivider />
                        </div>
                        <FloatingDecorations density="medium" />
                    </div>
                    
                    <div className="bg-card p-6 rounded-lg">
                        <p className="text-center text-muted-foreground mt-4">
                            Content section below...
                        </p>
                    </div>
                </section>

                {/* Nested Diamonds */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6">Nested Diamonds</h2>
                    <div className="flex justify-center space-x-8">
                        <DecorativeDiamond size="xl" variant="outline" nested />
                        <DecorativeDiamond size="2xl" variant="subtle" nested />
                        <DecorativeDiamond size="3xl" variant="gold" nested />
                    </div>
                </section>

                {/* Usage Examples */}
                <section className="bg-card p-8 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-6">Usage Examples</h2>
                    <div className="space-y-4 text-sm">
                        <div>
                            <h3 className="font-medium text-accent mb-2">Between Sections:</h3>
                            <code className="bg-muted p-2 rounded block">
                                {`<DecorativeSectionDivider />`}
                            </code>
                        </div>
                        
                        <div>
                            <h3 className="font-medium text-accent mb-2">In Card Corners:</h3>
                            <code className="bg-muted p-2 rounded block">
                                {`<CornerOrnament position="top-right" size="md" />`}
                            </code>
                        </div>
                        
                        <div>
                            <h3 className="font-medium text-accent mb-2">As Background Elements:</h3>
                            <code className="bg-muted p-2 rounded block">
                                {`<FloatingDecorations density="low" />`}
                            </code>
                        </div>
                        
                        <div>
                            <h3 className="font-medium text-accent mb-2">Custom Diamond:</h3>
                            <code className="bg-muted p-2 rounded block">
                                {`<DecorativeDiamond size="lg" variant="gradient" animated />`}
                            </code>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default DecorativeExamples;