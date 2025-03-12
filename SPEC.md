markit inputDir outputDir
  -> read all .mit files in inputDir
  -> write json text files to outputDir/txt
  -> write json html files to outputDir/html

json input format
  -> compile to json
  -> compile content to format (txt or html)
  -> enrich descendants with ancestor data
  -> replace subtext paths with metadata
  -> enrich descendants with previous/next metadata

json input format context
  -> compile to json
  -> compile content to txt or html
  -> add properties from context (inherit from ancestors)
  -> IF texts: fill with metadata
  -> ELSE IF context.texts: add metadata of previous and next

content input format
  -> compile to txt
  -> compile to html
