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
        """
        Generates the URLs from which to download SVGs given the Equation item

        Args:
            item (Equation)
            info (obj)

        Yields:
            scrapy.Request: Request object constructed with the url to the SVG
        """
        adapter = ItemAdapter(item)
        yield scrapy.Request(adapter["src_url"])

    def file_path(self, request, response=None, info=None, *, item=None):
        """
        Returns the file path 

        Args:
            request ([type]): [description]
            response ([type], optional): [description]. Defaults to None.
            info ([type], optional): [description]. Defaults to None.
            item ([type], optional): [description]. Defaults to None.

        Returns:
            str: Path to the SVG file
        """
        path = os.path.basename(urlparse(request.url).path)
        if (not path.endswith(".svg")):
            path += ".svg"
        print("Writing to... " + path)
        return path

    def item_completed(self, results, item, info):
        """
        Called when the item has finished downloading

        Args:
            results (list): List of results
            item (Equation): Equation items
            info ([type]): [description]

        Raises:
            DropItem: Item is dropped when it was not saved properly

        Returns:
            Equation: The item after modifying the path to the SVG locally
        """
        ok, resp = results[0]
        path = resp['path']
        if not path:
            raise DropItem("Item was not saved")

        adapter = ItemAdapter(item)
        adapter['path_to_svg'] = os.path.join(self.store_uri, path)
        return item
