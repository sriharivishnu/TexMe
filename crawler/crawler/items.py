import scrapy


class Equation(scrapy.Item):
    src_url = scrapy.Field()
    latex = scrapy.Field()
    path_to_svg = scrapy.Field()
