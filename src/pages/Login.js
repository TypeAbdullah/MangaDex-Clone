import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import authBackground from "../assets/images/authBackground.jpg";
import googleLogo from "../assets/svg/googleLogo.svg";
import { useAuth } from "../Auth/AuthProvider";
import { TailSpin } from 'react-loader-spinner'
import showToast from '../utils/toastUtils';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused] = useState("false");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const { login, token } = useAuth();

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [])

  const handleLogIn = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const logInParams = {
      email,
      password
    }

    try {

      await login(logInParams);
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  }

  const google = (e) => {
    e.preventDefault();

    window.open(`${process.env.REACT_APP_MANGA_SERVER_URL}/api/auth/google`, "_self");
  };


  return (
    <section className="text-sm bg-white md:grid md:grid-cols-2 justify-items-center">
      <div className="max-w-sm px-4 py-16 mx-auto ">
        <div className="text-center mb-9">
          <h2 className="mb-4 text-3xl font-medium text">
            Welcome <span className="text-[#1B6FA8]">back</span>!
          </h2>
          <p className="text-sm text-gray-500">
            Discover manga, manhua manwa, track your progress, have fun read
            manga.
          </p>
        </div>

        <form action="">
          {/* Email Input */}
          <div className="relative mb-5">
            <input
              type="text"
              placeholder="Email"
              className="peer h-full w-full rounded-[3px] border-2 border-gray-500 !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
              value={email}
              pattern={`[^@ \t\r\n]+@[^@ \t\r\n]+.[^@ \t\r\n]+`}
              required
              focused={focused}
              onBlur={() => setFocused("true")}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">It should be a valid email address!</span>
            <label className="absolute top-0 px-1 duration-300 -translate-y-1/2 bg-white peer-placeholder-shown:top-1/2 peer-focus:top-0 left-3">
              Email
            </label>
          </div>

          {/* Password Input */}
          <div className="relative mb-5">
            <input
              type="password"
              placeholder="Password"
              className="peer h-full w-full rounded-[3px] border-2 border-gray-500 !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="absolute top-0 px-1 duration-300 -translate-y-1/2 bg-white peer-placeholder-shown:top-1/2 peer-focus:top-0 left-3">
              Password
            </label>
          </div>

          {/* Checkbox input */}
          <div className="flex items-center justify-between my-4">
            <div className="flex items-center">
              <input type="checkbox" />
              <label className="ml-2">Remember me</label>
            </div>
            <Link to="/" className="text-[#1B6FA8] font-semibold">
              Recovery password
            </Link>
          </div>

          {/* Buttons */}
          <button
            className="flex justify-center items-center h-11 w-full text-center font-semibold text-white bg-[#1B6FA8] hover:bg-[#155580] rounded-[3px] mb-5"
            onClick={handleLogIn}
          >
            {isLoading ? <TailSpin
              height="20"
              width="20"
              color="#ffffff"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            /> : 'Log In'}
          </button>
          <button onClick={google} className="flex items-center justify-center w-full gap-2 mb-4 text-gray-500 border-2 border-gray-400 rounded-[3px] h-11">
            <img
              src={googleLogo}
              alt="google"
              className="inline-block w-6 h-6"
            />
            <span>Log in with Google</span>
          </button>
        </form>

        <div className="font-semibold text-center text-gray-600">
          <p className="mb-3">
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-[#1B6FA8]">
              Sign up
            </Link>
          </p>
          <p>
            Go back to{" "}
            <Link to="/" className="text-[#1B6FA8]">
              Home page
            </Link>
          </p>
        </div>
      </div>

      <img
        src={authBackground}
        className="w-full h-full "
        alt="auth background"
      />
    </section>
  );
};

export default Login;
