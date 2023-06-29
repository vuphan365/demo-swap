import {
  createBrowserRouter,
  useRouteError
} from "react-router-dom";
import App from 'views/App'
import Swap from 'views/Swap'


function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);
  return <div>I'm an bug, the developer is looking for me</div>;
}

const router = createBrowserRouter([
  {
    path: "/demo-swap",
    element: <App />,
    errorElement: (<ErrorBoundary />),
    children: [{
      index: true,
      element: <Swap />
    }],

  }
])

export default router