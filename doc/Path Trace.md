Path Trace
==========

简要梳理下Path Tracing算法的主流程，为webtix项目定下大纲。

### 主流程
```glsl
ray = ray_gen()
if hit = ray_hit(ray)
  light = select_light_source
  sample_light_mis(light)
  sample_bsdf_mis(hit.material)
```