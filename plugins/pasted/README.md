# nehan-pasted

This plugin provides <code>pasted</code> tag, shortcut markup for 'pasted' content.

<fiedlset>
<legend>What is pasted content?</legend>
<p>Pasted content is the content that is not parsed by nehan.js and 'pasted' as it is in the output of page.</p>
<p>It is usefull to <b>embed content</b> like twitter widget, facebook button etc.</p>
</fieldset>

Using <code>pasted</code> tag, you can write pasted content like this,

```html
<pasted size="200x200">
  some pasted content goes here
</pasted>
```

instead of writing like this.

```html
<div width="200" height="200" pasted>
  some pasted content goes here
</div>
```

# example

```html
<!-- using shortcut attribute {width}x{height} -->
<pasted size="200x200">
  some pasted content
</pasted>

<!-- or using normal attribute width and height -->
<pasted width="200" height="200">
  some pasted content
</pasted>
```
