function setValue(obj, heirarchy, val) {
  if (!heirarchy) return obj
  property = heirarchy.split('.')
  obj[property] = {}
  obj = obj[heirarchy.shift()]
  return setValue(obj , heirarchy, val)
}   
const data = {}
const newData = setValue(data,"one.two.three","four")
console.log(newData)
