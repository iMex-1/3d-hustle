import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { GiBrickWall, GiWoodBeam, GiCube } from 'react-icons/gi';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';
import '../styles/categories.css';

function Categories() {
    const navigate = useNavigate();
    
    const categories = [
        {
            id: 'zelige',
            name: 'Zelige',
            description: 'Carreaux de mosaïque traditionnels marocains',
            icon: GiBrickWall,
            color: '#BB86FC',
            count: 0
        },
        {
            id: 'boiserie',
            name: 'Boiserie',
            description: 'Panneaux et ornements en bois sculpté',
            icon: GiWoodBeam,
            color: '#03DAC6',
            count: 0
        },
        {
            id: 'platre',
            name: 'Plâtre',
            description: 'Décorations et moulures en plâtre',
            icon: BsFillGrid3X3GapFill,
            color: '#D4A5FF',
            count: 0
        },
        {
            id: 'autre',
            name: 'Autre',
            description: 'Autres éléments décoratifs et architecturaux',
            icon: GiCube,
            color: '#CF6679',
            count: 0
        }
    ];

    const handleCategoryClick = (categoryName) => {
        navigate(`/gallery/category/${categoryName}`, { state: { category: categoryName } });
    };

    return (
        <div className="categories-page">
            <div className="categories-header">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Catégories
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="categories-subtitle"
                >
                    Explorez notre collection organisée par type d'élément architectural
                </motion.p>
            </div>

            <div className="categories-grid">
                {categories.map((category, index) => {
                    const IconComponent = category.icon;
                    return (
                        <motion.div
                            key={category.id}
                            className="category-card"
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 0.95 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{
                                scale: 1.05,
                                y: -8,
                                transition: { duration: 0.3, ease: "easeOut" }
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleCategoryClick(category.name)}
                        >
                            <div className="category-icon-wrapper" style={{ '--category-color': category.color }}>
                                <IconComponent className="category-icon" />
                            </div>
                            <div className="category-content">
                                <h2>{category.name}</h2>
                                <p>{category.description}</p>
                                <div className="category-footer">
                                    <motion.button
                                        className="category-btn"
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Explorer <FaArrowRight />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

export default Categories;
