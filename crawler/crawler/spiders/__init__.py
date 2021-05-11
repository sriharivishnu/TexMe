import scrapy
from scrapy.linkextractors import LinkExtractor
from crawler.items import Equation


# https://en.wikipedia.org/wiki/List_of_equations
class WikiEquationCrawler(scrapy.Spider):
    """Class for a Spider that scrapes latex equations and SVGs from 
    Wikipedia.
    """
    name = "equation_crawler"
    BASE_URL = 'https://en.wikipedia.org/wiki'
    start_urls = [f"{BASE_URL}/List_of_equations"]
    count = 0

    def parse(self, response):
        """
        Parses the start URLs (only one given). This page contains all the urls
        that the spider will visit

        Args:
            response: Response from a web page
        Yields:
            scrapy.Request: Returns a request

        """
        extractor = LinkExtractor(
            allow="^https://en\.wikipedia\.org/wiki/[^#]*(?i)(equation|law|relation)[^#]*$")
        for link in extractor.extract_links(response):
            yield scrapy.Request(
                link.url,
                callback=self.parse_equation
            )

    def parse_equation(self, response):
        """
        Parses the pages with math equations

        Args:
            response ([type]): [description]

        Yields:
            Equation: An equation item that contains the src url and the
            latex equation
        """
        equations = response.css("img.mwe-math-fallback-image-inline")
        for equation in equations:
            src = equation.css("img::attr(src)").get()
            latex = equation.css("img::attr(alt)").get().strip()
            yield Equation(src_url=src, latex=latex)
