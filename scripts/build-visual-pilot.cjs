const {buildAll}=require('../packages/real-estate-renderer/index.cjs');
const result=buildAll();
console.log(`Piloto visual generado: ${result.results.length} perfiles, ${result.results.reduce((sum,item)=>sum+item.pages,0)} páginas.`);
