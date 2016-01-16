# nehan-lazy

This plugin provides element with `lazy` attribute.

<fiedlset>
<legend>What is lazy content?</legend>
<p>Lazy content is the content that is not parsed by nehan.js and 'pasted' as it is in the output of page.</p>
</fieldset>

Using `lazy` tag, you can write lazy element like this,

```html
<lazy size="200x200">
  some lazy content goes here
</lazy>
```

instead of writing like this.

```html
<div width="200" height="200" lazy>
  some lazy content goes here
</div>
```

## Install

```html
<script type="text/javascript" src="/path/to/nehan.js"></script>
<script type="text/javascript" src="/path/to/nehan.lazy.js"></script>
```

## Example

```html
<!-- using shortcut attribute {width}x{height} -->
<lazy size="200x200">
  some lazy content
</lazy>

<!-- or using normal attribute width and height -->
<lazy width="200" height="200">
  some lazy content
</lazy>
```
