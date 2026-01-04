import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { GiBrickWall, GiWoodBeam, GiCube } from "react-icons/gi";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import "../styles/categories.css";

function Categories() {
  const navigate = useNavigate();

  const categories = [
    {
      id: "zelige",
      name: "Zelige",
      description: "Carreaux de mosaïque traditionnels marocains",
      icon: GiBrickWall,
      color: "hsl(42, 80%, 55%)", // Gold
      count: 0,
    },
    {
      id: "boiserie",
      name: "Boiserie",
      description: "Panneaux et ornements en bois sculpté",
      icon: GiWoodBeam,
      color: "hsl(15, 60%, 45%)", // Terracotta
      count: 0,
    },
    {
      id: "platre",
      name: "Plâtre",
      description: "Décorations et moulures en plâtre",
      icon: BsFillGrid3X3GapFill,
      color: "hsl(35, 40%, 75%)", // Sand
      count: 0,
    },
    {
      id: "autre",
      name: "Autre",
      description: "Autres éléments décoratifs et architecturaux",
      icon: GiCube,
      color: "hsl(210, 60%, 35%)", // Moroccan Blue
      count: 0,
    },
  ];

  const handleCategoryClick = (categoryName) => {
    navigate(`/gallery/category/${categoryName}`, {
      state: { category: categoryName },
    });
  };

  // Container animation for staggered children - slower, more elegant
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  // Card animation variants - smoother, lantern-like feel
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <div className="categories-page">
      <div className="categories-header">
        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Catégories
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.15,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="categories-subtitle"
        >
          Explorez notre collection organisée par type d'élément architectural
        </motion.p>
      </div>

      <motion.div
        className="categories-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <motion.div
              key={category.id}
              className="category-card"
              variants={cardVariants}
              whileHover={{
                y: -6,
                scale: 1.02,
                transition: {
                  duration: 0.5,
                  ease: [0.25, 0.1, 0.25, 1],
                },
              }}
              whileTap={{
                scale: 0.98,
                transition: { duration: 0.15, ease: "easeOut" },
              }}
              onClick={() => handleCategoryClick(category.name)}
            >
              <div
                className="category-icon-wrapper"
                style={{ "--category-color": category.color }}
              >
                <IconComponent className="category-icon" />
              </div>
              <div className="category-content">
                <h2>{category.name}</h2>
                <p>{category.description}</p>
                <div className="category-footer">
                  <motion.button
                    className="category-btn"
                    whileHover={{
                      x: 3,
                      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
                    }}
                    whileTap={{
                      scale: 0.97,
                      transition: { duration: 0.15, ease: "easeOut" },
                    }}
                  >
                    Explorer <FaArrowRight />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

export default Categories;
