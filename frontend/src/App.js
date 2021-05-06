import "./assets/scss/App.scss";
import { useState, useMemo } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import { Moon, Sun } from "react-feather";
import { Document, Page, pdfjs } from "react-pdf";
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

import pdfTest from "./assets/img/Srihari_Vishnu_Resume_v2.pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

require("codemirror/lib/codemirror.css");
require("codemirror/theme/duotone-light.css");
require("codemirror/theme/material-darker.css");
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
  const [PNGTransparent, setTransparent] = useState(true);

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
      latex,
      format,
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

  const pdfViewer = useMemo(
    () => (
      <Document file={pdfTest} className="pdf-viewer" style={{ borderRadius: "10px" }}>
        <Page pageNumber={1} />
      </Document>
    ),
    []
  );
  const onClickSave = () => {
    download(output, `${new Date()}.svg`, "image/svg+xml");
  };
  const download = (text, name, type) => {
    const a = document.createElement("a");
    a.style.display = "none";
    var file = new Blob([text], { type: type });
    a.href = URL.createObjectURL(file);
    a.download = name;
    document.body.appendChild(a);
    a.click();
  };

  return (
    <div className={`App ${darkMode ? "dark" : "light"}`}>
      <Navbar color="dark" dark={true} expand="md">
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
      <h1 className={`title ${darkMode ? "dark" : "light"}`}>Type in Latex Below</h1>

      <div className={`container ${darkMode ? "dark" : "light"}`}>
        <CodeMirror
          value={code}
          options={{ theme: darkMode ? "material-darker" : "duotone-light" }}
          onBeforeChange={(editor, data, value) => {
            setCode(value);
            onRender(value);
          }}
          onChange={(editor, value) => {}}
        />
      </div>
      <div
        className={`${darkMode ? "dark" : "light"} text-center `}
        id="output"
        dangerouslySetInnerHTML={{
          __html: output,
        }}></div>

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
        <Button className="ml-2" onClick={onClickSave}>
          Save
        </Button>
      </div>
      {/* {pdfViewer} */}
    </div>
  );
};

export default App;
