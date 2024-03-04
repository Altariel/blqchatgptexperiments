import Navbar from "./navbar";
import useSWR from 'swr';
 
export default function Layout({children}: {children: JSX.Element[] | JSX.Element}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}
