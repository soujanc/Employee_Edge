// import React from 'react';
// import { Outlet, useLocation } from 'react-router-dom';
// import Dashboard from './pages/Dashboard/Dashboard';
// import Sidemenutwo from './components/Sidemenutwo';
// import RequireAuth from './components/RequireAuth';

// export default function Layt() {
//     const location = useLocation();
//     const isLoginPage = ['/login', '/Register', '/forgetPass','/newPass','/logout'].includes(location.pathname);
//   return (
//     <div style={{ display: 'flex', flexDirection: 'column'}}>
//       {/* Dashboard as a common component */}
//       <RequireAuth>
//       <Dashboard />
//       </RequireAuth>
//       {isLoginPage ? (
        
//           <Outlet /> 
        
//             // Render the login page in place of the Outlet
//           ) : (
//             <div style={{ display: 'flex', flexGrow: 1 }}>
//         {/* Sidemenu */}
//         <RequireAuth>
//         <Sidemenutwo />
//         </RequireAuth>
        
        
        
//         {/* Main content area (Outlet) */}
//         <div style={{ flexGrow: 1 }}>
        
//           <Outlet/>
          
          
//         </div>
//       </div>
//           )}
//       {/* Flex container for Sidemenu and Outlet */}
//     </div>
//   )
// }

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Sidemenutwo from './components/Sidemenutwo';
import RequireAuth from './components/RequireAuth';

export default function Layt() {
  const location = useLocation();
  const isAuthPage = ['/login', '/Register', '/forgetPass', '/newPass', '/logout'].includes(location.pathname);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {isAuthPage ? (
        // Render the Outlet for authentication pages without requiring authentication
        <Outlet />
      ) : (
        // Wrap the main layout in RequireAuth to protect it
        <RequireAuth>
          {/* Flex container for Dashboard, Sidemenu, and Outlet */}
          <div style={{ display: 'flex', flexGrow: 1 }}>
            {/* Dashboard as a common component */}
            <Dashboard />
            
            {/* Sidemenu */}
            <Sidemenutwo />
            
            {/* Main content area (Outlet) */}
            <div style={{ flexGrow: 1 }}>
              <Outlet />
            </div>
          </div>
        </RequireAuth>
      )}
    </div>
  );
}

