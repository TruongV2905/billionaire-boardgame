import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store";
import StartPage from "./page/StartPage";
import PlayingPage from "./page/PlayingPage";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <StartPage />,
    },
    {
      path: "/playing",
      element: <PlayingPage />,
    },
  ]);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  );
}

export default App;
