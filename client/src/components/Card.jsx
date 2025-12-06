import { motion } from 'framer-motion'

const Card = ({ children, className = '', hover = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
      className={`bg-white rounded-xl shadow-md ${hover ? 'hover:shadow-xl' : ''} transition-all duration-300 p-6 ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default Card


