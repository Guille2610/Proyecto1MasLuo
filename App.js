import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, TextInput } from 'react-native';
import { Button, RadioButton } from 'react-native-paper';


export default function App() {


  const [costoVehiculo, setCostoVehiculo] = useState('');
  const [salario, setSalario] = useState('');

  const [transmision, setTransmision] = useState('manual'); // 'manual' o 'automatica'
  const [pago, setPago] = useState('contado'); // 'credito' o 'contado'
  const [resultado, setResultado] = useState(null);
  const [aprobacion, setAprobacion] = useState(null);

  // precios
  const cargoAutomatico = 1500.00; 
  const itbms = 0.07;
  const interesCredito = 0.08;
  const plazoMeses = 12 * 9; // plazo de 9 años 

  //variables de estilo
  
  const textoTransmision = // variable derivada para mostrar el mensaje de aviso dependiendo del tipo de transmisión seleccionada
    transmision === 'automatica'
      ? 'Opción: Transmisión Automática. Se aplicará un cargo adicional de $1500 al precio base del vehículo.'
      : 'Opción: Transmisión Manual. No se aplicará ningún cargo adicional al precio base del vehículo.';


  const textoPago = // vaiable derivada para mostrar el mensaje de aviso dependiendo de la forma de pago seleccionada
  pago === 'credito'
    ? 'Opción: Crédito. Ten en cuenta que el precio total incluirá intereses y el pago mensual no debe exceder el 30% de tu salario.'
    : 'Opción: Contado. Sólo se sumará el 7%.';


  //--------------FUNCIONES DE CÁLCULO-----------------

  // Precio base del vehículo
  function calcularPrecioBase(costoVehiculo, transmision) {
    let precioBase = costoVehiculo;
    if (transmision === 'automatica') {
      precioBase += cargoAutomatico;
    }
    return precioBase;    
  }

  function calcularPrecioConInteres(precioBase) {
    return precioBase * Math.pow((1 + interesCredito), 9);
  }

  // Cálculo del impuesto
  function calcularImpuesto(precioBase) {
    let subtotal;
    if (pago === 'contado') { 
      subtotal = precioBase;
      } else if (pago === 'credito') {  
      subtotal = calcularPrecioConInteres(precioBase);
      }
      return subtotal * itbms;
    }

  // Cálculo del total a pagar
  function calcularTotal(precioBase) {
    let subtotal2;
    if (pago === 'contado') {
      subtotal2 = precioBase;
      } else if (pago === 'credito') {
      subtotal2 = calcularPrecioConInteres(precioBase);
      }
    return subtotal2 + (subtotal2 * itbms);
  }

  // Cálculo de la cuota mensual
  function calcularCuotaMensual(total) {
    if (pago === 'credito') {
      return total / plazoMeses;
    } else {
      return null;
    }
  }

  // Determinar si el cliente es aprobado o rechazado
  function determinarAprobacion(letraMensual, salario) {
    let porcentajeSalario = salario * 0.30; // El pago mensual no debe exceder el 30% del salario
    let aprobado = porcentajeSalario >= letraMensual ? "Aprobado" : "Rechazado";
    return { aprobado, porcentajeSalario };
  }

  // Función que se ejecuta cuando el usuario presiona el botón de calcular
  function btnCalcular() {
    const precioVehiculo = parseFloat(costoVehiculo);
    const salarioCliente = parseFloat(salario);

    if (isNaN(precioVehiculo) || (pago === 'credito' && isNaN(salarioCliente))) { //si el precio no es un número válido o si se seleccionó crédito y el salario no es un número válido, se muestra un mensaje de error
      setResultado("Por favor, ingrese valores numéricos válidos para el costo del vehículo y el salario.");
      return;
    }

    const precioBase = calcularPrecioBase(precioVehiculo, transmision);
    const impuesto = calcularImpuesto(precioBase);
    const total = calcularTotal(precioBase);
    

    let resultadoTexto = `Precio Base: $${precioBase.toFixed(2)}\n`;
    resultadoTexto += `ITBMS (7%): $${impuesto.toFixed(2)}\n\n`;
    resultadoTexto += `Total a Pagar: $${total.toFixed(2)}\n\n`;
  
    if (pago === 'credito') {
      const cuotaMensual = calcularCuotaMensual(total);
      const { aprobado, porcentajeSalario } = determinarAprobacion(cuotaMensual, salarioCliente);

      resultadoTexto += `Letra Mensual: $${cuotaMensual.toFixed(2)}\n`;
      resultadoTexto += `30% del salario: $${porcentajeSalario.toFixed(2)}\n`;
      
      setAprobacion(`Estado: ${aprobado} (Pago mensual representa el ${((cuotaMensual / salarioCliente) * 100).toFixed(2)}% del salario)`);
      
    }

    else if (pago === 'contado') {
      setAprobacion(null); // No se muestra estado de aprobación para pago al contado
    }

    setResultado(resultadoTexto);
  }

 //-------------FRONT-END-----------------
  return (
    <ScrollView style={styles.container}>


      <View style={styles.topBar}>
        <Image source={require('./assets/generalmotors.png')} style={styles.imageIcon} />
        <Text style={styles.indexTitle}>Genesis & Mas Motors</Text>
      </View>
            <Image source={require('./assets/image.png')} style={{ width: '100%', height: 100, marginBottom: 16 }} />
      <View style={styles.titleWrapper}>
        <Text style={styles.subtitle}>Venta de Autos. ¡Consulte nuestros precios!</Text>
    </View>

    <View style={styles.innerContainer}> 
      <TextInput
          style={styles.textInputEntrada}
          value={costoVehiculo}
          onChangeText={setCostoVehiculo}
          placeholder={"Costo del Vehículo"}
          placeholderTextColor="#aaa"
          keyboardType="decimal-pad"
      />
      <TextInput
          style={pago === 'credito' ? styles.textInputEntrada : styles.textinputEntradaDisabled} // Cambia el estilo dependiendo de si el campo está habilitado o no
          value={pago === 'credito' ? salario : ''} // Muestra el valor del salario solo si se selecciona crédito
          editable={pago === 'credito'}
          onChangeText={setSalario}
          placeholder={pago === 'credito' ? "Salario bruto mensual" : "Salario bruto mensual (No disponible)"} // Cambia el placeholder dependiendo de si el campo está habilitado o no
          placeholderTextColor="#aaa"
          keyboardType="decimal-pad"
      />
      <Text style={styles.sectionTitle}>Tipo de Transmisión:</Text>

      <View style={styles.radiobuttonContainer}>
        <RadioButton.Item
          style={styles.radioButton}
          label="Manual"
          value="manual"
          color='#0569ff'
          status={transmision === 'manual' ? 'checked' : 'unchecked'}
          onPress={() => setTransmision('manual')}
        />
        <RadioButton.Item
          style={styles.radioButton}
          label="Automática"
          value="automatica"
          color='#0569ff'
          status={transmision === 'automatica' ? 'checked' : 'unchecked'}
          onPress={() => setTransmision('automatica')}
        />
        <Text style={styles.subtitle}>{textoTransmision}</Text>
      </View>

      <Text style={styles.sectionTitle}>Forma de Pago:</Text>

        <View style={pago === 'credito' ? styles.radiobuttonContainerPaymentCred : styles.radiobuttonContainerPaymentCont}>
          <RadioButton.Item
            style={styles.radioButton}
            label="Contado"
            value="contado"
            color='#51ceff'
            status={pago === 'contado' ? 'checked' : 'unchecked'}
            onPress={() => setPago('contado')}
          />
          <RadioButton.Item
            style={styles.radioButton} 
            label="Crédito"
            value="credito"
            color='#054cff'
            status={pago === 'credito' ? 'checked' : 'unchecked'}
            onPress={() => setPago('credito')}
          />
          <Text style={styles.subtitle}>{textoPago}</Text>
        </View>
      </View>

      <Button mode="contained" onPress={btnCalcular} style={styles.buttonCalc}>
        Calcular
      </Button>

      <View style={styles.resultadoContainer}>
        <Text style={styles.sectionTitle}>Resultado:</Text>
        <Text style={styles.resultadoText}>{resultado}</Text>
        <View style={{display: aprobacion ? 'flex' : 'none', marginTop: 16, alignItems: 'center', width: '100%', marginBottom: 16, padding: 12, borderRadius: 8, borderColor: '#396aff', borderWidth: 2, backgroundColor: '#ffffff' }}>
        <Text style={aprobacion?.includes('Aprobado') ? styles.aprobado : styles.rechazado}>
          {aprobacion}
        </Text>
        </View>
      </View>

    </ScrollView>
  );
  
}

//Estilos para la aplicación

const styles = StyleSheet.create({

  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 32,
  },


  //Contenedor interno para inputs y opciones
  innerContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 2,
    gap: 10,
  
  },

  //Contenedor maestro
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10, 
    marginLeft: 20,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    height: 100,
    width: '100%',
    backgroundColor: '#0569ff',
    paddingTop: 45,
    paddingLeft: 15,
    marginBottom: 10,
    
  },

  radiobuttonContainer: {
    backgroundColor: '#e7e7e7',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  radiobuttonContainerPaymentCont: {
    backgroundColor: '#ffffff',
    borderColor: '#51ceff',
    borderWidth: 3,
    padding: 10,
    borderRadius: 8,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  radiobuttonContainerPaymentCred: {
      backgroundColor: '#ffffff',
      borderColor: '#054cff',
      borderWidth: 3,
      padding: 10,
      borderRadius: 8,
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginBottom: 16,
    },

  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginRight: 20,
  },

  buttonCalc: {
    backgroundColor: '#1b44ff',
    marginHorizontal: 16,
    marginBottom: 16,

  },




  titleWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  imageIcon: {
    width: 50,
    height: 50,
    marginRight: 8,
  },


  indexTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#edf1f1',
  },

  subtitle: {
    fontSize: 18,
    marginBottom: 8,
  },


  textInputEntrada: { 
    backgroundColor: "#f9f9f9", 
    borderRadius: 15, 
    borderWidth: 1.0,
    borderColor: "#acacac", 
    color: "#111", 
    fontSize: 16, 
    paddingHorizontal: 15, 
    paddingVertical:15, 
  },

  textinputEntradaDisabled: {
    backgroundColor: "#e0e0e0", 
    borderRadius: 15,
    borderWidth: 1.0,
    borderColor: "#acacac", 
    color: "#111", 
    paddingHorizontal: 15, 
    paddingVertical:15, 
  },


  // ESTILO: CONTENEDOR RESULTADO
  resultadoContainer: {
    height: 'auto',
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    padding: 26,
    paddingBottom: 70,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },

  resultadoText: {
    fontSize: 18,
    color: '#333'
  },

    // ESTILOS: PAGO APROBADO O RECHAZADO


  estadoContainer: {
    marginTop: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    width: '100%',
    
  },

  aprobado: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1df833',
    marginTop: 3,
    marginBottom: 8,
  },
  
  rechazado: { 
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff0000',
    marginTop: 3,
    marginBottom: 8,
  },


});

