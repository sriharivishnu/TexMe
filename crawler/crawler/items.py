# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class Equation(scrapy.Item):
    src_url = scrapy.Field()
    latex = scrapy.Field()
    path_to_svg = scrapy.Field()
