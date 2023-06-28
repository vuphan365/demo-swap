import {
  createBrowserRouter,
} from "react-router-dom";
import App from 'views/App'
import Swap from 'views/Swap'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [{
      index: true,
      element: <Swap />
    }]
  }
])

export default router