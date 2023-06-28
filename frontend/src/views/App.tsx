import { Outlet } from "react-router-dom";
import { Box } from '@chakra-ui/react'
import Header from 'components/Header/Header'
import { useInitDapp } from 'hooks/useInitDapp'

const App = () => {
  useInitDapp()

  return (
    <Box>
      <Header />
      <Outlet />
    </Box>
  )
}

export default App