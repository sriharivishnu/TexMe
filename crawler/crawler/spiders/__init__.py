import scrapy
from scrapy.linkextractors import LinkExtractor
from crawler.items import Equation

# https://en.wikipedia.org/wiki/List_of_equations


class WikiEquationCrawler(scrapy.Spider):
    name = "equation_crawler"
    BASE_URL = 'https://en.wikipedia.org/wiki'
    start_urls = [f"{BASE_URL}/List_of_equations"]
    count = 0

    def parse(self, response):
        extractor = LinkExtractor(
            allow="^https://en\.wikipedia\.org/wiki/[^#]*(?i)(equation|law|relation)[^#]*$")
        for link in extractor.extract_links(response):
            yield scrapy.Request(
                link.url,
                callback=self.parse_equation
            )

    def parse_equation(self, response):
        equations = response.css("img.mwe-math-fallback-image-inline")
        for equation in equations:
            src = equation.css("img::attr(src)").get()
            latex = equation.css("img::attr(alt)").get().strip()
            yield Equation(src_url=src, latex=latex)
