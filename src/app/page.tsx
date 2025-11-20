import React from "react";

const ErrorPage = () => {
  return (
    <div className="grid h-screen place-content-center bg-gray-900">
      <div className="text-center">
        <h1 className="mb-[20px] text-9xl font-black text-gray-700">Oops! </h1>

        <p className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
          We are on maintainance, We'll be back soon
        </p>


        <p className="mt-4 text-gray-400">
          We apologize for the inconvenience.
        </p>

        <a
          href="/"
          className="mt-6 inline-block rounded bg-primary-600 px-5 py-3 text-sm font-medium text-white hover:bg-primary-600 hover:opacity-75 focus:outline-none focus:ring"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
