import { Button, Card, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import "./App.css";
import type { Idea } from "./service";
import { MemoService } from "./service";
import { isEmpty } from "lodash";

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
        flexGrow: 1,
      }}>
      <Button
        variant='contained'
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
        }}>
        {ideas.fields.map((field, idx) => {
          return <CardIdea field={field} idx={idx} form={form} />;
        })}
      </div>
    </div>
  );
}

export default App;

interface CardIdeaProps {
  idx: number;
  field: any;
  form: UseFormReturn<
    {
      ideas: Idea[];
    },
    any
  >;
}
function CardIdea(props: CardIdeaProps) {
  return (
    <Card
      variant='outlined'
      id={props.field.key}
      style={{
        width: 150,
        height: 150,
        margin: 10,
      }}>
      <Controller
        render={({ field }) => {
          console.log({ field, propsField: props.field });
          const { ref, ...fieldProps } = field;
          return (
            <TextField
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
          return (
            <TextField
              {...fieldProps}
              label='body'
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
    </Card>
  );
}
