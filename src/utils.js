
export function withinRange(p1, p2, range=0, epsilon=0.1) {
  return Math.abs(Math.abs(p1 - p2) - range) <= epsilon;
}

export function any(list) {
  return list.reduce((result, next) => result || next, false);
}

export function argmax(list) {
  if (list.length === 0) { return null; }
  return list.reduce((maxPos, value, valuePos, list) => list[maxPos] < value ? valuePos : maxPos, 0)
}

export function connectedComponents(elements, isConnected) {
  let components = [];
  elements.forEach(element => {
    let matchingComponents = 
      components
      .filter(component => 
        any(component.map(otherElement => 
          isConnected(element, otherElement))
        )
      );
    if (matchingComponents.length === 1) {
      matchingComponents[0].push(element);
    } else if (matchingComponents.length > 1) {
      let newComponent = matchingComponents.map(a => a.splice(0, a.length)).flat();
      newComponent.push(element);
      components.push(newComponent);
      components = components.filter(c => c.length > 0);
    } else {
      components.push([element]);
    }
  });
  return components;
}