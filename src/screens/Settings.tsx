import { Component } from "solid-js";
import CustomButton from "../components/Buttons"
import {Link} from "@solidjs/router";

const HomeScreen: Component = () => {

  return (
      <Link href={"/"}>
        <CustomButton>Settings Page</CustomButton>
      </Link>
  );
};

export default HomeScreen;
