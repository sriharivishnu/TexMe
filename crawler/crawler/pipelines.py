# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter, adapter
import scrapy
from scrapy.exceptions import DropItem
import os
from urllib.parse import urlparse
from scrapy.pipelines.files import FilesPipeline


class EquationPipeline(FilesPipeline):
    def __init__(self, settings=None):
        self.store_uri = settings['FILES_STORE']

        super(EquationPipeline, self).__init__(
            store_uri=settings['FILES_STORE'], settings=settings)

    @classmethod
    def from_settings(cls, settings):
        return cls(
            settings=settings
        )

    def get_media_requests(self, item, info):
        adapter = ItemAdapter(item)
        yield scrapy.Request(adapter["src_url"])

    def file_path(self, request, response=None, info=None, *, item=None):
        path = os.path.basename(urlparse(request.url).path)
        if (not path.endswith(".svg")):
            path += ".svg"
        print("Writing to... " + path)
        return path

    def item_completed(self, results, item, info):
        print(results)
        ok, resp = results[0]
        path = resp['path']
        if not path:
            raise DropItem("Item was not saved")

        adapter = ItemAdapter(item)
        adapter['path_to_svg'] = os.path.join(self.store_uri, path)
        return item
