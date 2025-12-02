import { motion } from 'framer-motion';
import { useState } from 'react';
import '../styles/stacked-cards.css';

const Card = ({ className = '', image, icon: Icon, children, isHovered }) => {
    return (
        <div className={`stacked-card ${className}`}>
            {image && (
                <div className="stacked-card-image">
                    <img src={image} alt="card" />
                </div>
            )}
            {Icon && (
                <motion.div
                    className="stacked-card-icon"
                    animate={{
                        scale: isHovered ? 1.1 : 1,
                        rotate: isHovered ? [0, -3, 3, 0] : 0
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                    <Icon />
                </motion.div>
            )}
            {children && (
                <div className="stacked-card-content">
                    {children}
                </div>
            )}
        </div>
    );
};

const StackedCardsInteraction = ({
    cards,
    spreadDistance = 40,
    rotationAngle = 5,
    animationDelay = 0.1,
    onClick
}) => {
    const [isHovering, setIsHovering] = useState(false);

    // Limit to maximum of 3 cards
    const limitedCards = cards.slice(0, 3);

    return (
        <div className="stacked-cards-container">
            <div className="stacked-cards-wrapper">
                {limitedCards.map((card, index) => {
                    const isFirst = index === 0;
                    let xOffset = 0;
                    let rotation = 0;

                    if (limitedCards.length > 1) {
                        // First card stays in place
                        // Second card goes left
                        // Third card goes right
                        if (index === 1) {
                            xOffset = -spreadDistance;
                            rotation = -rotationAngle;
                        } else if (index === 2) {
                            xOffset = spreadDistance;
                            rotation = rotationAngle;
                        }
                    }

                    return (
                        <motion.div
                            key={index}
                            className={`stacked-card-motion ${isFirst ? 'z-top' : 'z-bottom'}`}
                            initial={{ x: 0, rotate: 0, zIndex: isFirst ? 10 : 0, opacity: 0, y: 15 }}
                            animate={{
                                x: isHovering ? xOffset : 0,
                                rotate: isHovering ? rotation : 0,
                                zIndex: isHovering && isFirst ? 20 : (isFirst ? 10 : 0),
                                opacity: 1,
                                y: 0
                            }}
                            transition={{
                                duration: 0.2,
                                ease: [0.25, 0.1, 0.25, 1],
                                delay: index * animationDelay,
                            }}
                            onHoverStart={isFirst ? () => setIsHovering(true) : undefined}
                            onHoverEnd={isFirst ? () => setIsHovering(false) : undefined}
                            onClick={isFirst ? onClick : undefined}
                        >
                            <Card
                                className={isFirst ? 'z-top cursor-pointer' : 'z-bottom'}
                                image={card.image}
                                icon={card.icon}
                                isHovered={isHovering && isFirst}
                            >
                                <h3>{card.title}</h3>
                                <p>{card.description}</p>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export { StackedCardsInteraction, Card };
