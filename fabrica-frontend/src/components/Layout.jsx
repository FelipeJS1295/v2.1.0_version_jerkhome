import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const layoutStyle = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh'
};

const contentWrapperStyle = {
  display: 'flex',
  flex: 1
};

const mainContentStyle = {
  flex: 1,
  padding: '1rem'
};

function Layout({ children }) {
  return (
    <div style={layoutStyle}>
      <Header />
      <div style={contentWrapperStyle}>
        <Sidebar />
        <main style={mainContentStyle}>{children}</main>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
