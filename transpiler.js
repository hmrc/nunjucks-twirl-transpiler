const parser = require('./nunjucks/src/parser')
const compiler = require('./nunjucks/src/compiler')
const transformer = require('./nunjucks/src/transformer')
const nodes = require('./nunjucks/src/nodes')

const fs = require('fs')


const inputStr = fs.readFileSync(process.argv[2], 'utf8')

const ast = transformer.transform(parser.parse(inputStr), []);

const filters = {
  safe: node => {
    const out = []
    out.push(printNodes(node.args, '@Html(', ')'))
    return out.join('')
  }
}

function printNodes(node, variablePrefix, variablePostfix) {
  const output = []
  const varPrefix = variablePrefix || '@{'
  const varPostfix = variablePostfix || '}'

  if (node instanceof nodes.NodeList) {
    node.children.forEach((n) => {
      output.push(printNodes(n, variablePrefix, variablePostfix))
    })
  } else if (node instanceof nodes.LookupVal || node instanceof nodes.Symbol) {
    output.push(varPrefix)
    if (node.target) {
      output.push('(')
      output.push(node.target.value)
      output.push(' \\ "')
      output.push(node.val.value)
      output.push('").as[String]')
    } else {
      output.push(node.value)
    }
    output.push(varPostfix)
  } else if (node instanceof nodes.Value) {
    node.iterFields((val) => {
      output.push(val)
    })
  } else if (node instanceof nodes.If || node instanceof nodes.InlineIf) {
    if (node.cond.left) {
      output.push('<!-- multiple conditions -->')
    } else {
      output.push('@if((')
      output.push(node.cond.target.value)
      output.push(' \\ "')
      output.push(node.cond.val.value)
      output.push('").toOption.isDefined) {')
      output.push(printNodes(node.body, variablePrefix, variablePostfix))
      output.push('}')
      if (node.else_) {
        output.push('else {')
        output.push(printNodes(node.else_, variablePrefix, variablePostfix))
        output.push('}')
      }
    }
  } else if (node instanceof nodes.For) {
    output.push('@for((')
    output.push(node.name.children[0].value)
    output.push(', ')
    output.push(node.name.children[1].value)
    output.push(') <- ((')
    output.push(node.arr.target.value)
    output.push(') \\ "')
    output.push(node.arr.val.value)
    output.push('").as[Map[String, String]]){')
    output.push(printNodes(node.body, variablePrefix, variablePostfix))
    output.push('})')
  } else if (node instanceof nodes.Filter) {
    const filterName = node.name.value
    const filterHandler = filters[filterName]
    if (filterHandler) {
      output.push(filterHandler(node))
    } else {
      output.push(`<!-- NO HANDLER FOR FILTER [${filterName}] -->`)
    }
  } else {
    output.push(`[unrecognised ${node.typename}]`)
  }
  return output.join('')
}

const boilerplate = ['@import play.api.libs.json.JsValue', '@(params: JsValue)', ''].join('\n')

console.log(boilerplate + printNodes(ast))



