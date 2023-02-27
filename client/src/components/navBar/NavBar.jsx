import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { BsCart4 } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useLocalStorage } from "../../customHooks/UseLocalStore";
import { fetchSearch } from "../../redux/thunks/productThunk";
import Login from "../buttons/Login/Login";
import Logout from "../buttons/Logout/Logout";
import { CartModal } from "../modals/cart/index";
import "./NavBar.css";

const NavBar = () => {
  const history = useHistory();
  const [isClicked, setIsClicked] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth0();
  const [text, setText] = useLocalStorage("text", "");
  const [rutaHistorial, setRutaHistorial] = useState({
    home: false,
    products: false,
    about: false,
  });

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/")
      setRutaHistorial({ ...rutaHistorial, home: true });
    if (location.pathname === "/products")
      setRutaHistorial({ ...rutaHistorial, products: true });
    if (location.pathname === "/about")
      setRutaHistorial({ ...rutaHistorial, about: true });
  }, [location.pathname]);

  const { amountOfItems } = useSelector((state) => state.cart);

  function submitSearch(e) {
    e.preventDefault();
    dispatch(fetchSearch(text));
    history.push("/products");
  }

  return (
    <div>
      <nav class="navbar navbar-expand-lg border-bottom">
        <div class="container-fluid d-flex justify-content-center ">
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>

          <img
            src={require("./media/logoh.png")}
            style={{ width: "50px" }}
            alt=""
          />

          <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
            <ul class="navbar-nav mb-2 mb-lg-0 text-center fs-5 align-items-center">
              <li className="nav-item">
                <a
                  className={
                    location.pathname === "/"
                      ? "nav-link mt-1 route-flag route-hover"
                      : "nav-link mt-1 route-hover"
                  }
                  href="/"
                >
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={
                    location.pathname === "/products"
                      ? "nav-link mt-1 route-flag route-hover"
                      : "nav-link mt-1 route-hover"
                  }
                  href="/products"
                >
                  Products
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={
                    location.pathname === "/about"
                      ? "nav-link mt-1 route-flag route-hover"
                      : "nav-link mt-1 route-hover"
                  }
                  href="/about"
                >
                  About
                </a>
              </li>
            </ul>
            <div>
              <form
                class="d-flex justify-content-center"
                role="search"
                onSubmit={submitSearch}
              >
                <input
                  class="form-control me-2"
                  placeholder="Search by name"
                  value={text}
                  name="filter-by-name"
                  aria-label="Search"
                  onChange={(e) => setText(e.target.value)}
                />
                <button class="btn btn-outline-success" type="submit">
                  Search
                </button>
              </form>
            </div>
            <ul class="navbar-nav mb-2 mb-lg-0 text-center fs-5 align-items-center">
              <li>
                <div className="shoppingCart">
                  <div
                    className={
                      amountOfItems === 0 ? "negativeCounter" : "counter"
                    }
                  >
                    {amountOfItems}
                  </div>
                  <BsCart4
                    className="carIcon"
                    onClick={() => setIsClicked(!isClicked)}
                  />
                  {isClicked && <CartModal />}
                </div>
              </li>
              <li>
                <div class="btn-group">
                  <button
                    type="button"
                    class="btn btn-primary dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i class="bi bi-person-square" />
                  </button>
                  {isAuthenticated ? (
                    <ul class="dropdown-menu dropdown-menu-end justify-content-center">
                      <li>
                        <Link className="nav-link mt-1" to="/profile">
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link className="nav-link mt-1" to="/shoppingCart">
                          Cart
                        </Link>
                      </li>
                      <li>
                        <hr class="dropdown-divider" />
                      </li>
                      <li>
                        <Logout />
                      </li>
                    </ul>
                  ) : (
                    <ul class="dropdown-menu justify-content-center">
                      <li>
                        <Login message="Login" />
                      </li>
                    </ul>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
