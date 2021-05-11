import mathJax from "mathjax-node";
mathJax.config({
  MathJax: {},
});
mathJax.start();

/**
 *
 * @param {*} res
 * @param {str} latex equation to converted to SVG
 * @returns Response Status. Possible Status Codes:
 * - 200: SVG generated successfully
 * - 400: Error occurred while generating the SVG from latex
 */
export const getSVG = async (res, latex) => {
  try {
    const data = await mathJax.typeset({ math: latex, format: "TeX", svg: true });
    return res.status(200).send({ svg: data.svg });
  } catch (err) {
    return res.status(400).send({ message: "An error occurred while creating SVG", error: err });
  }
};

export const getPNG = () => {};
export const getPDF = () => {};
