# nehan-math

Display mathematical expression by [MathJax](https://mathjax.org/).

## Dependencies

[MathJax.js](https://mathjax.org/) is required.

## Install

```html
<script type="text/x-mathjax-config">
  // configure MathJax.
  MathJax.Hub.Config({
    tex2jax: {inlineMath: [["$","$"],["\\(","\\)"]]}
  });
</script>
<script type="text/javascript" src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML"></script>
<script type="text/javascript" src="/path/to/nehan.js"></script>
<script type="text/javascript" src="/path/to/nehan.math.js"></script>
```

## Example

```html
<math>$$ E = mc^2$$</math>
<math>\[ e^{i\theta} = \cos\theta + i\sin\theta \]</math>
```

