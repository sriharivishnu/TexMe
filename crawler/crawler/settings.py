BOT_NAME = 'crawler'

SPIDER_MODULES = ['crawler.spiders']
NEWSPIDER_MODULE = 'crawler.spiders'

USER_AGENT = 'crawler (+http://www.sriharivishnu.com)'

ROBOTSTXT_OBEY = True

CONCURRENT_REQUESTS = 32

FEEDS = {
    'equations.csv': {
        'format': 'csv',
        'encoding': 'utf8',
        'store_empty': False,
        'fields': None,
        'indent': 4,
        'item_export_kwargs': {
                    'export_empty_fields': True,
        },
    }
}

FILES_STORE = './data'

ITEM_PIPELINES = {
    'crawler.pipelines.EquationPipeline': 1,
}
