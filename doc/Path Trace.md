Path Trace
==========

简要梳理下Path Tracing算法的主流程，为webtix项目定下大纲。

### 主流程
```glsl
ray = ray_gen()

throughput = 1
radiance = 0
for depth in max_depth:
  hit = scene_intersection(ray)
  if hit light:
    radiance += throughput * emission
    return
  if sample_light(ray):
    brdf, pdf = brdf_eval(hit, light_ray)
    radiance += emission * throughput * brdf * dot(normal, ray) / pdf
  ray, brdf, pdf = brdf_sample(hit, material)
  throughput *= brdf * dot(normal, ray) / pdf
```

### TODO
- add btdf procedure, convert brdf to bsdf