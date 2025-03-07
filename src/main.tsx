import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { unstableSetRender } from 'antd';
import store, { persistor } from './store/index.ts';
import { PersistGate } from 'redux-persist/integration/react';

unstableSetRender((node, container) => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-expect-error
	container._reactRoot ||= createRoot(container);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-expect-error
	const root = container._reactRoot;
	root.render(node);
	return async () => {
		await new Promise((resolve) => setTimeout(resolve, 0));
		root.unmount();
	};
});

const themeConfig = {
	token: {
		colorPrimary: '#4DA2D6',
		green: '#5CCC81',
		colorError: '#FF4A33',
		red: '#FF4A33',
	},
	components: {
		Button: {
			contentFontSizeLG: 14,
			contentLineHeightLG: 18,
			controlHeightLG: 44,
			paddingInlineLG: 24,
		},
		Table: {
			// headerBg: 'white',
			colorBgContainer: '#F2F4F7',
			borderColor: '#DAE3F1',
		},
	},
};

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<ConfigProvider theme={themeConfig}>
					<style>
						{`:root {
          --ant-primary-color: ${themeConfig.token.colorPrimary};
          --ant-green-color: ${themeConfig.token.green};
          --ant-error-color: ${themeConfig.token.colorError};
          --ant-red-color: ${themeConfig.token.red};
        }`}
					</style>
					<App />
				</ConfigProvider>
			</PersistGate>
		</Provider>
	</StrictMode>
);
