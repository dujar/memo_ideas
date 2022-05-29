import {
  Button,
  Card,
  CardContent,
  LinearProgress,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  Controller,
  useFieldArray,
  UseFieldArrayReturn,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import "./App.css";
import type { Idea } from "./service";
import { MemoService } from "./service";
import { isEmpty } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, styled } from "@mui/system";

import { faTrash } from "@fortawesome/free-solid-svg-icons";

const service = new MemoService();
function App() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  useEffect(() => {
    service.get().then(setIdeas);
  }, []);

  return isEmpty(ideas) ? null : <MemoForm ideas={ideas} />;
}

function MemoForm(props: { ideas: Idea[] }) {
  const form = useForm<{ ideas: Idea[] }>({
    defaultValues: {
      ideas: props.ideas,
    },
  });
  const ideas = useFieldArray({
    name: "ideas",
    control: form.control,
    keyName: "key",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        alignContent: "center",
      }}>
      <Button
        variant='contained'
        style={{
          margin: 15,
          cursor: "pointer",
        }}
        onClick={() => {
          service.getNew().then((idea) => {
            ideas.append(
              {
                id: idea.id,
                body: "",
                title: "",
                created_date: idea.created_date,
              },
              { shouldFocus: true }
            );
          });
        }}>
        Add an Idea
      </Button>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          alignContent: "center",
          justifyItems: "center",
          height: "90vh",
          overflowY: "scroll",
          width: "100%",
        }}>
        {/* <Box sx={{ width: "100%" }}>{isSuccess && <LinearProgress />}</Box> */}
        {ideas.fields.map((field, idx) => {
          return (
            <CardIdea
              key={field.key}
              field={field}
              idx={idx}
              form={form}
              ideas={ideas}
            />
          );
        })}
      </div>
    </div>
  );
}

interface CardIdeaProps {
  idx: number;
  field: any;
  ideas: UseFieldArrayReturn<
    {
      ideas: Idea[];
    },
    "ideas",
    "key"
  >;
  form: UseFormReturn<
    {
      ideas: Idea[];
    },
    any
  >;
}

const StyledTextField = styled(TextField)`
  input:focus {
    border: 2px solid #cdcdcd;
    border-radius: 1px;
  }
`;
function CardIdea(props: CardIdeaProps) {
  const [hasBin, setBin] = useState(false);

  return (
    <Card
      id={props.field.key}
      onMouseOver={() => setBin(true)}
      onMouseLeave={() => setBin(false)}
      variant='outlined'
      style={{
        width: 150,
        height: 150,
        margin: 10,
      }}>
      <CardContent>
        <Controller
          render={({ field }) => {
            const { ref, ...fieldProps } = field;
            return (
              <StyledTextField
                key={props.field.key}
                {...fieldProps}
                label='title'
                variant='standard'
                inputRef={ref}
                onBlur={() => {
                  service.updateIdea({
                    id: props.field.id,
                    body: props.field.body,
                    title: field.value,
                  });
                  field.onBlur();
                }}
              />
            );
          }}
          name={`ideas.${props.idx}.title`}
          control={props.form.control}
        />
        <Controller
          render={({ field }) => {
            const { ref, ...fieldProps } = field;
            let label = "body";
            if (fieldProps.value && fieldProps.value.length < 15) {
              label += ` ${fieldProps.value.length}`;
            }
            return (
              <StyledTextField
                key={props.field.key}
                {...fieldProps}
                label={label}
                variant='standard'
                inputRef={ref}
                onBlur={() => {
                  service.updateIdea({
                    id: props.field.id,
                    body: field.value,
                    title: props.field.title,
                  });
                  field.onBlur();
                }}
              />
            );
          }}
          name={`ideas.${props.idx}.body`}
          control={props.form.control}
        />
      </CardContent>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          width: "90%",
          padding: 5,
        }}>
        <div style={{ height: 20, width: 20 }} />
        {hasBin && (
          <FontAwesomeIcon
            onClick={() => {
              service.deleteIdea({ id: props.field.id }).then((result) => {
                if (result) {
                  props.ideas.remove([props.idx]);
                }
              });
            }}
            style={{
              color: "grey",
              height: 10,
              cursor: "pointer",
            }}
            icon={faTrash}
          />
        )}
      </div>
    </Card>
  );
}
export default App;
