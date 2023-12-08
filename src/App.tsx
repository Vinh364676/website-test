import React from 'react';
import './App.scss';
import { ROUTE_PATHS } from './constants/url-config';
import { BrowserRouter, Redirect, Switch } from 'react-router-dom';
import RouteLayout from './components/views/layout/route-layout';
import Loading from './components/atoms/loading/loading';
import Notification from './components/atoms/notification/notification';
import { routes } from './routing';
import { Provider as ReduxProvider } from 'react-redux';
import { persistor, store } from './redux/store';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { AuthProvider } from './contexts/JwtContext';


function App() {

	return (
		<div className="App">
			<AuthProvider>
				<ReduxProvider store={store}>
					<PersistGate loading={null} persistor={persistor}>
						<Loading />
						<Notification />
						<BrowserRouter>
							<Switch>
								{routes.map(({ href, exact, component, permissions, loginRequired,isLayout }) => (
									<RouteLayout
										key={href}
										path={href}
										exact={exact}
										component={component}
										permissions={permissions}
										loginRequired={loginRequired}
										isLayout = {!!isLayout}
									/>
								))}
								<Redirect to={ROUTE_PATHS.SignIn} />
							</Switch>
						</BrowserRouter>
					</PersistGate>
				</ReduxProvider>
			</AuthProvider>

		</div>
	)
}

export default App;
