export default function block (text: string, parentId?: string): any {
  const result: any = {
    name: 'p',
    id: null,
    content: text.trim()
  }

  const tagCheck = text.match(/^{(.*?)}\s+/)
  if (tagCheck) {
    // set the content as everything apart from the tag
    result.content = result.content.replace(/^{(.*?)}\s+/, '')

    // parse the properties
    const properties = tagCheck[1].split(',').map(x => x.trim())

    for (const property of properties) {
      const titleCheck = property.match(/^title$/)
      const idCheck = property.match(/^#(.*?)$/)
      const nameValueCheck = property.match(/^(.*?)=(.*?)$/)
      if (titleCheck) {
        result.name = 'head'
      } else if (idCheck) {
        result.id = parentId ? `${parentId}.${idCheck[1]}` : idCheck[1]
      } else if (nameValueCheck) {
        result[nameValueCheck[1]] = nameValueCheck[2]
      } else {
        throw new Error(`Malformed property "${property}".`)
      }
    }
  }

  return result
}
