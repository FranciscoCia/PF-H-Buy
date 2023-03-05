import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../redux/thunks/productThunk";
import { newGoogleUser } from "../../../redux/thunks/userThunk";
import CardLoader from "../../CardLoader/CardLoader";
import CarouselBanner from "./carousels/banner/CarouselBanner";
import CarouselProducts from "./carousels/products/CarouselProducts";
import "./Home.css";

const Home = () => {
  const images = ["baner1.jpg", "baner2.jpg", "baner0.jpg"];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dispatch = useDispatch();
  const { user } = useAuth0();
  const { userLocal } = useSelector((state) => state.user);
  const { topViews } = useSelector((state) => state.product);
  const item = window.localStorage.getItem("history");
  const history = JSON.parse(item);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setLoader(true);
    verifyAuth();
    dispatch(fetchProducts());
    setLoader(false);
    const reloj = setInterval(() => {
      selectNewImage(selectedIndex, images);
    }, 3000);
    return () => clearInterval(reloj);
    //eslint-disable-next-line
  }, [dispatch, user]);

  function verifyAuth() {
    if (user) {
      if (!userLocal.email) {
        if (user.given_name) {
          console.log("no hay");
          const newUserAuth = {
            name: user.given_name,
            lastName: user.family_name,
            image: user.picture,
            email: user.email,
          };
          dispatch(newGoogleUser(newUserAuth));
        } else {
          console.log("no hay");
          const newUserAuth = {
            name: user.nickname,
            image: String(user.picture),
            email: user.email,
          };
          dispatch(newGoogleUser(newUserAuth));
        }
      }
    }
  }

  const selectNewImage = (images, next = true) => {
    setTimeout(() => {
      const condition = next
        ? selectedIndex < images.length - 1
        : selectedIndex > 0;
      const nextIndex = next
        ? condition
          ? selectedIndex + 1
          : 0
        : condition
        ? selectedIndex - 1
        : images.length - 1;
      setSelectedIndex(nextIndex);
    }, 500);
  };

  return loader ? (
    <CardLoader />
  ) : (
    <div className="home">
      <div className="carousel-banner">
        <a href="/home/products">
          <CarouselBanner />
        </a>
      </div>
      <hr />
      {topViews.length ? (
        <>
          <h2 className="text-center">Top 5 Products More views</h2>
          <div class="container-fluid carousel-productos">
            <CarouselProducts array={topViews} />
          </div>
          <hr />
        </>
      ) : null}

      {history ? (
        <>
          <h2 className="text-center">According to your last searches</h2>
          <div class="container-fluid carousel-productos">
            <CarouselProducts array={history} />
          </div>
          <hr />
        </>
      ) : null}
      <div className="text-center">
        <h1>Want to see more products?</h1>
        <a href="/home/products">
          <button className="btn btn-secondary">Click here</button>
          <hr />
        </a>
      </div>
    </div>
  );
};

export default Home;
