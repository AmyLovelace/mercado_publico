import { forwardRef} from 'react';
import { Box, Typography} from '@mui/material';

const AboutUsSection = forwardRef((props, ref) => {

  return (
<Box
  sx={{
    mt: 6,
    px: { xs: 2, sm: 4 },
    py: { xs: 4, sm: 6 },
    maxWidth: '900px',
    mx: 'auto',
    bgcolor: '#f9f9f9',
    borderRadius: 4,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    border: '1px solid #e0e0e0',
  }}
  ref={ref}
>
  <Typography
    variant="h4"
    component="h3"
    fontWeight="bold"
    gutterBottom
    sx={{ textAlign: 'center', color: '#333' }}
  >
    Sobre las Licitaciones
  </Typography>

  <Typography
    variant="body1"
    sx={{ color: '#444', lineHeight: 1.8, mt: 2, textAlign: 'justify' }}
  >
    El <strong>Mercado Público</strong> es la plataforma oficial donde las instituciones del Estado de Chile
    publican sus necesidades de productos y servicios. A través de este sistema, proveedores de todos los tamaños
    pueden acceder a oportunidades de negocio mediante procesos de licitación abiertos y transparentes.
  </Typography>

  <Typography
    variant="body1"
    sx={{ color: '#444', lineHeight: 1.8, mt: 2, textAlign: 'justify' }}
  >
    Las licitaciones siguen un ciclo estructurado que incluye la publicación del requerimiento, recepción de ofertas,
    evaluación, adjudicación y cierre. Esta información es pública, actualizada y supervisada, fomentando la
    competencia justa y la eficiencia en el uso de recursos del Estado.
  </Typography>

  <Typography
    variant="body1"
    sx={{ color: '#444', lineHeight: 1.8, mt: 2, textAlign: 'justify' }}
  >
    Nuestra aplicación simplifica este acceso, permitiéndote buscar licitaciones según la fecha, estado del proceso
    o RUT del proveedor. Así puedes mantenerte informado, detectar oportunidades relevantes y participar fácilmente.
  </Typography>
</Box>



  );
});

export default AboutUsSection;
