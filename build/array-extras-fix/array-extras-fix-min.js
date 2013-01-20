YUI.add("array-extras-fix",function(e){var t=e.Array;t.remove=function(e,t,n){var r=e.slice((n||t)+1||e.length);return e.length=t<0?e.length+t:t,e.push.apply(e,r)}});
