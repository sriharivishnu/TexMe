import scrapy


class Equation(scrapy.Item):
    """
    Equation item for the fields that are scraped
    from the Wikipedia pages
    """
    src_url = scrapy.Field()
    latex = scrapy.Field()
    path_to_svg = scrapy.Field()
