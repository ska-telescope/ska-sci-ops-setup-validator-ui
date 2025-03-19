{{/*
Selector labels
*/}}
{{- define "labels" -}}
app.kubernetes.io/name: {{ $.Chart.Name }}
{{- end }}

{{/*
set the ingress url path
*/}}
{{- define "ingress.path" }}
{{- if .Values.ingress.prependByNamespace -}}
/{{ .Release.Namespace }}/{{ .Values.ingress.path }}
{{- else if .Values.ingress.path -}}
/{{ .Values.ingress.path }}
{{- else -}}

{{- end }}
{{- end }}
