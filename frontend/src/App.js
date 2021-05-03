import "./assets/scss/App.scss";
import { useState } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import { Moon, Sun } from "react-feather";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  Collapse,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  ButtonDropdown,
} from "reactstrap";

require("codemirror/lib/codemirror.css");
require("codemirror/theme/xq-dark.css");
require("codemirror/theme/monokai.css");
require("codemirror/mode/stex/stex");

const App = () => {
  //Constants
  const formatOptions = ["SVG", "PNG", "PDF"];
  const BACKEND_URL = "http://localhost:8080";

  //States
  const [isNavBarOpen, setIsNavBarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [format, setFormat] = useState(formatOptions[0]);
  const [code, setCode] = useState("");
  const [darkMode, setDark] = useState(true);
  const [output, setOutput] = useState("");

  //State togglers
  const toggleNavbar = () => setIsNavBarOpen(!isNavBarOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleDarkmode = () => setDark(!darkMode);
  const onFormatChange = (evt) => {
    setFormat(evt.target.innerText);
  };

  //Logic
  const onRender = async (latex) => {
    if (!latex) return;
    const payload = {
      latex: latex,
    };
    // console.log(JSON.stringify(payload));
    try {
      const res = await fetch(`${BACKEND_URL}/latex`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      setOutput(json.svg);
    } catch (exception) {
      console.error(exception);
    }
  };

  return (
    <div className={`App ${darkMode ? "dark" : "light"}`}>
      <Navbar color={`${darkMode ? "dark" : "light"}`} dark={darkMode} expand="md">
        <NavbarBrand href="/">TexMe</NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} />
        <Collapse isOpen={isNavBarOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/about/">About</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
            </NavItem>
          </Nav>
          {darkMode ? (
            <Sun
              className={`icon-clickable ${darkMode ? "dark" : "light"}`}
              onClick={toggleDarkmode}
            />
          ) : (
            <Moon
              className={`icon-clickable ${darkMode ? "dark" : "light"}`}
              onClick={toggleDarkmode}
            />
          )}
        </Collapse>
      </Navbar>

      <div className={`container ${darkMode ? "dark" : "light"}`}>
        <CodeMirror
          value={code}
          options={{ theme: darkMode ? "monokai" : "xq-light" }}
          onBeforeChange={(editor, data, value) => {
            setCode(value);
            onRender(value);
          }}
          onChange={(editor, value) => {}}
        />
      </div>

      <div className="d-inline-flex w-100 mt-2 justify-content-center">
        <ButtonDropdown isOpen={isDropdownOpen} toggle={toggleDropdown} id="dropdown-format">
          <DropdownToggle caret>{format}</DropdownToggle>
          <DropdownMenu>
            {formatOptions.map((item, index) => (
              <DropdownItem onClick={onFormatChange} key={index}>
                {item}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </ButtonDropdown>
        <Button className="ml-2">Save</Button>
      </div>
      <div
        className="text-center"
        id="output"
        dangerouslySetInnerHTML={{
          __html: output,
        }}></div>
    </div>
  );
};

export default App;
