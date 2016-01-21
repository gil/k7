var fs = require('fs');
var spawn = require('child_process').spawn;
var program = require('commander');
var yaml = require('js-yaml');
 
program
  .version('0.0.1')
  .option('-r, --run [index]', 'run command at given index')
  .option('-p, --print [index]', 'print command at given index')
  .option('-e, --edit', 'edit commands file')
  .option('-g, --group [index]', 'group index [0]', '0')
  .parse(process.argv);
 
if( program.edit ) {

  var editor = process.env.EDITOR || 'vim';
  spawn(editor, ['.rec'], { stdio: 'inherit' });

} else {

  var args = program.args;
  var groups = null;

  try {
    groups = yaml.safeLoad(fs.readFileSync('.rec', 'utf8'));
  } catch(e) {
    groups = {};
  }

  var group = groups[program.group] = groups[program.group] || [];

  if( args.length === 0 ) {
    var index = program.run || program.print || group.length - 1;
    args = group[index].args;
  } else {
    group.push({
      args: args
    });
    fs.writeFileSync('.rec', yaml.safeDump(groups), 'utf8');
  }

  if( program.print ) {
    args.unshift('echo');
  }

  spawn(args[0], args.slice(1), { stdio: 'inherit' });
}
