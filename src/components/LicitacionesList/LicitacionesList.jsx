import React, { forwardRef, useState } from 'react';
import {
  Accordion, AccordionSummary, AccordionDetails,
  Button, TextField, InputAdornment, Grid, Typography,
  CircularProgress, Tabs, Tab, Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DatePicker, LocalizationProvider, PickersDay } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { useMediaQuery, useTheme } from '@mui/material';

const estados = ['Todas', 'revocada', 'adjudicada', 'publicada', 'cerrada'];

const BusquedaLicitaciones = forwardRef(({ ticket, onSelect, ...props }, ref) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [fecha, setFecha] = useState(null);
  const [estado, setEstado] = useState('Todas');
  const [rutProveedor, setRutProveedor] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [fechasConLicitaciones, setFechasConLicitaciones] = useState([]);
  const [detalles, setDetalles] = useState({});
  const [error, setError] = useState(null);
  const [proveedorInfo, setProveedorInfo] = useState(null);

  const formatFecha = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}${(d.getMonth() + 1).toString().padStart(2, '0')}${d.getFullYear()}`;
  };

  const fetchPorFechaEstado = async () => {
    if (!fecha) {
      setError('Debes seleccionar una fecha.');
      return;
    }
  
    setLoading(true);
    setError(null);
    setProveedorInfo(null);
    setData([]);
    setDetalles({});
    setFechasConLicitaciones([]);
  
    try {
      const f = formatFecha(fecha);
      const url = `https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?fecha=${f}${estado !== 'Todas' ? `&estado=${estado}` : ''}&ticket=${ticket}`;
  
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error en la solicitud');
      const json = await res.json();
      const listado = (json.Listado || []).slice(0, 10);
      setData(listado);
      const fechas = listado.map(item => item.FechaCierre?.split('T')?.[0]);
      setFechasConLicitaciones(fechas);
    } catch (err) {
      setError('No se encontraron resultados o hubo un problema con la solicitud.');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchPorProveedor = async () => {
    if (!rutProveedor) {
      setError('Debes ingresar un RUT.');
      return;
    }
  
    setLoading(true);
    setError(null);
    setProveedorInfo(null);
    setData([]);
    setDetalles({});
    setFechasConLicitaciones([]);
  
    try {
      const url = `https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?rutProveedor=${rutProveedor}&ticket=${ticket}`;
  
      const proveedorRes = await fetch(
        `https://api.mercadopublico.cl/servicios/v1/Publico/Empresas/BuscarProveedor?rutempresaproveedor=${rutProveedor}&ticket=${ticket}`
      );
      const proveedorJson = await proveedorRes.json();
      setProveedorInfo(proveedorJson.listaEmpresas?.[0] || null);
  
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error en la solicitud');
      const json = await res.json();
      const listado = (json.Listado || []).slice(0, 10);
      setData(listado);
    } catch (err) {
      setError('No se encontraron resultados o hubo un problema con la solicitud.');
    } finally {
      setLoading(false);
    }
  };
  
  

  const fetchDetalle = async (codigo) => {
    if (detalles[codigo]) return;
    try {
      const res = await fetch(`https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?codigo=${codigo}&ticket=${ticket}`);
      if (!res.ok) throw new Error('Error al obtener detalles');
      const json = await res.json();
      setDetalles(prev => ({ ...prev, [codigo]: json.Listado?.[0] || null }));
    } catch {
      setDetalles(prev => ({ ...prev, [codigo]: { error: 'No se pudo obtener el detalle.' } }));
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 },
    }),
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, display: 'flex', flexDirection: 'column', gap: 2,maxWidth:'700px',width:'50vw' }} ref={ref}>
      <Typography
        variant="body1"
        sx={{ color: '#444', lineHeight: 1.8, mt: 2, textAlign: 'justify' }}
      >
        <strong>Búsqueda de Licitaciones</strong>
      </Typography>
     <Tabs
        value={tab}
        onChange={(e, newValue) => {
          setTab(newValue);
          setError(null);
          setData([]);
          setDetalles({});
          setProveedorInfo(null);
        }}
        orientation={isSmallScreen ? 'vertical' : 'horizontal'}
        variant={isSmallScreen ? 'scrollable' : 'standard'}
        sx={{
          display: isSmallScreen ? 'flex' : 'block',
          flexDirection: isSmallScreen ? 'column' : 'row',
          width: '100%',
          '& .MuiTab-root': {
            width: isSmallScreen ? '100%' : 'auto',
          }
        }}
      >
        <Tab label="Por Fecha y Estado" />
        <Tab label="Por RUT Proveedor" />
      </Tabs>


      {tab === 0 && (
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <DatePicker
                label="Fecha de cierre"
                value={fecha}
                onChange={setFecha}
                minDate={new Date(2000, 0, 1)}
                maxDate={new Date(2029, 11, 31)}
                renderDay={(day, _value, DayComponentProps) => {
                  const formatted = day.toLocaleDateString('sv-SE');
                  const tieneLicitacion = fechasConLicitaciones.includes(formatted);
                  return (
                    <PickersDay
                      {...DayComponentProps}
                      sx={{
                        bgcolor: tieneLicitacion ? '#a5d6a7' : 'transparent',
                        borderRadius: '50%',
                        '&:hover': {
                          bgcolor: tieneLicitacion ? '#81c784' : 'action.hover',
                        },
                      }}
                    />
                  );
                }}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} >
            <TextField
              select fullWidth label="Estado" value={estado}
              onChange={(e) => setEstado(e.target.value)}
              SelectProps={{ native: true }}
            >
              {estados.map(e => <option key={e} value={e}>{e}</option>)}
            </TextField>
          </Grid>
        </Grid>
      )}

      {tab === 1 && (
        <TextField
          fullWidth
          label="RUT del proveedor"
          value={rutProveedor}
          onChange={(e) => setRutProveedor(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start">RUT</InputAdornment>,
          }}
        />
      )}
      <Button
        variant="contained"
        onClick={() => {
          if (tab === 0) {
            fetchPorFechaEstado();
          } else {
            fetchPorProveedor();
          }
        }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Buscar'}
      </Button>


      {error && (
        <Box mt={2}>
          <Typography color="error" variant="body2">{error}</Typography>
        </Box>
      )}

    <Box mt={4} width="100%">
            {tab === 1 && proveedorInfo && (
          <Box mt={3} p={2} bgcolor="background.paper" borderRadius={2} boxShadow={2}>
            <Typography variant="h6" gutterBottom>
              Resultados para proveedor:
            </Typography>
            <Typography variant="subtitle1"><strong>{proveedorInfo.NombreEmpresa}</strong></Typography>
            <Typography variant="body2">Código Empresa: {proveedorInfo.CodigoEmpresa}</Typography>
          </Box>
        )}
        {!loading && data.map((item, i) => (
          <motion.div
            key={item.CodigoExterno}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={itemVariant}
          >
            <Accordion
             sx={{
              mb: 2,
              width: '100%',
              '& .MuiAccordionDetails-root': {
                maxHeight: 300,
                overflowY: 'auto',
                overflowX: 'auto',
              }
            }}
              onChange={(_, expanded) => expanded && fetchDetalle(item.CodigoExterno)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${item.CodigoExterno}-content`}
                id={`panel-${item.CodigoExterno}-header`}
              >
                <Box sx={{ maxWidth: '100%' }}>
                  <Typography variant="subtitle1" fontWeight="bold" noWrap   sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
                  >
                    {item.Nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    Código: {item.CodigoExterno}
                  </Typography>
                </Box>
              </AccordionSummary>

              <AccordionDetails
                sx={{
                  wordBreak: 'break-word',
                  px: { xs: 1, sm: 2 },
                  py: 1,
                }}
              >
                <Typography variant="body2" gutterBottom>
                  <strong>Estado:</strong> {item.CodigoEstado}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Fecha Cierre:</strong> {new Date(item.FechaCierre).toLocaleDateString('es-CL')}
                </Typography>
                {item.Descripcion && (
                  <Typography variant="body2" gutterBottom   sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
>
                    <strong>Descripción:</strong> {item.Descripcion}
                  </Typography>
                )}
                {detalles[item.CodigoExterno] && detalles[item.CodigoExterno].error ? (
                  <Typography variant="body2" color="error">{detalles[item.CodigoExterno].error}</Typography>
                ) : detalles[item.CodigoExterno] && (
                  <Box
                      mt={2}
                      p={2}
                      bgcolor="background.paper"
                      borderRadius={2}
                      boxShadow={2}
                      sx={{
                        overflowX: 'auto',
                        maxWidth: '100%',
                        wordBreak: 'break-word'
                      }}>
                    <Typography variant="h6" gutterBottom  sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
                    >{detalles[item.CodigoExterno].Nombre}</Typography>
                    <Typography variant="body2" className="mt-2"  sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
                    >{detalles[item.CodigoExterno].Descripcion}</Typography>
                    <Typography variant="body2" className="mt-1">Organismo: {detalles[item.CodigoExterno].Comprador?.NombreOrganismo}</Typography>
                    <Typography variant="body2">Monto Estimado: {detalles[item.CodigoExterno].MontoEstimado?.toLocaleString('es-CL')} CLP</Typography>
                    {detalles[item.CodigoExterno].Estado?.toLowerCase() === 'adjudicada' && detalles[item.CodigoExterno].Items?.Listado?.[0]?.Adjudicacion && (
                      <Box mt={2}>
                        <Typography variant="body2"><strong>Proveedor Adjudicado:</strong> {detalles[item.CodigoExterno].Items.Listado[0].Adjudicacion.NombreProveedor}</Typography>
                        <Typography variant="body2"><strong>RUT:</strong> {detalles[item.CodigoExterno].Items.Listado[0].Adjudicacion.RutProveedor}</Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
});
export default BusquedaLicitaciones;
