Simple Geometry Format
======================

### header
name        | type | description
------------|------|------------
magic number|u32 x 1  | value 0x42
index count |u32 x 1 | index buffer length
position count | u32 x 1 | position buffer count
total length | u32 x 1 | file byte length
placeholder | u32 x 4 | placeholder

header to total length 32 bytes

### content
> i in index count  
> n is position count  

name        | type | description
------------|------|------------
index buffer | u32 x i| index buffer data
position buffer | f32 x 3 x n | position buffer data
normal buffer | f32 x 3 x n | normal buffer data
texcoord buffer | f32 x 3 x n| texcoord buffer data 