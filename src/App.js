import {Routes,Route} from "react-router-dom"
import Home from "./Components/Home/Home"
import ProductDetails from "./Components/ProductDetails/ProductDetails"
import AddProduct from "./Components/AddProduct/AddProduct"
import Contact from "./Components/Contact/Contact"
import About from "./Components/About/About"

function App(params) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/items/:id" element = {
        <ProductDetails/>
      }/>
      <Route path="/contact" element = {
        <Contact/>
      }/>
      <Route path="/about" element = {
        <About/>
      }/>
      <Route path="/addProduct" element = {
        <AddProduct/>
      }/>
    </Routes>
  )
}

export default App