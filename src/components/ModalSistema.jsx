import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import "../css/modal.css";

class ModalSistema extends React.Component {
  state = {
    abierto: false,
  };

  abrirModal = () => {
    this.setState({ abierto: !this.state.abierto });
  };
  render() {
    return (
      <>
        <div className="principal">
          <div className="secundario">
            <Button onClick={this.abrirModal}>Mostrar Modal</Button>
          </div>
        </div>

        <Modal isOpen={this.state.abierto}>
          <ModalHeader>Iniciar sesion</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="usuario">Usuario</Label>
              <Input type="text" id="usuario"></Input>
            </FormGroup>
            <FormGroup>
              <Label for="pin">Contra</Label>
              <Input type="text" id="pin"></Input>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button>Iniciar Sesion</Button>
            <Button onClick={this.abrirModal}>Cerrar</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default ModalSistema;
