<?php
function convert_ntu($x)
{
    return (($x - 0) * (0 - 800)) / (4095 - 0) + 800;
}

function convert_ph($x)
{
    return 7.00 + ((1.25 - ($x * 0.000862)) / ((1.85 - 1.25) / 3));
}
